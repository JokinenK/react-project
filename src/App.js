import './App.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'

class NewUserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      app: props.app,
      name: '',
      email: '',
      phone: ''
    };
    
    this.onNameEdit = this.onNameEdit.bind(this);
    this.onEmailEdit = this.onEmailEdit.bind(this);
    this.onPhoneEdit = this.onPhoneEdit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onNameEdit(event) {
    this.setState({ name: event.target.value });
  }

  onEmailEdit(event) {
    this.setState({ email: event.target.value });
  }

  onPhoneEdit(event) {
    this.setState({ phone: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    var user = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone
    };

    if (this.state.app.validateUser(user)) {
      this.state.app.onInsert(user);
      this.setState( {name: '', email: '', phone: ''} );
    }
  }

  render() {
    return (
      <div className="userCreate">
          <form onSubmit={(event) => this.onSubmit(event)}>
          <input className="userCreateInput userCreateInputName" type="text" placeholder="Full name" value={this.state.name} onChange={(event) => this.onNameEdit(event)} />
          <input className="userCreateInput userCreateInputEmail" type="text" placeholder="E-mail address" value={this.state.email} onChange={(event) => this.onEmailEdit(event)} />
          <input className="userCreateInput userCreateInputPhone" type="text" placeholder="Phone number" value={this.state.phone} onChange={(event) => this.onPhoneEdit(event)} />
          <input className="userCreateInput userCreateInputSubmit" type="submit" value="Add new" />
        </form>
      </div>
    );
  }
}

class UserRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      app: props.app, 
      editing: false,
      name: '',
      email: '',
      phone: ''
    };

    this.onToggleEditing = this.onToggleEditing.bind(this);
    this.onNameEdit = this.onNameEdit.bind(this);
    this.onEmailEdit = this.onEmailEdit.bind(this);
    this.onPhoneEdit = this.onPhoneEdit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.setEditing = this.setEditing.bind(this);
  }

  onToggleEditing(event) {
    this.setEditing(!this.state.editing);
  }

  onNameEdit(event) {
    this.setState({ name: event.target.value });
  }

  onEmailEdit(event) {
    this.setState({ email: event.target.value });
  }

  onPhoneEdit(event) {
    this.setState({ phone: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    var user = { 
      name: this.state.name, 
      email: this.state.email, 
      phone: this.state.phone, 
      id: this.props.id 
    };

    if (this.state.app.validateUser(user)) {
      this.state.app.onEdit(user);
      this.setEditing(false);
    }
  }

  onDelete(event) {
    event.preventDefault();

    this.setEditing(false);
    this.state.app.onDelete(this.props.id);
  }

  setEditing(editing) {
    var name = editing ? this.props.name : '';
    var email = editing ? this.props.email : '';
    var phone = editing ? this.props.phone : '';

    this.setState({editing: editing, name: name, email: email, phone: phone});
  }

  renderView() {
    return (
      <div className="userTableRow">
        <div className="userTableCell userTableCellName">{this.props.name}</div>
        <div className="userTableCell userTableCellEmail">{this.props.email}</div>
        <div className="userTableCell userTableCellPhone">{this.props.phone}</div>
        <div className="userTableCell userTableCellEdit">
          <FontAwesomeIcon className="iconEdit" icon={faPencilAlt} onClick={(event) => this.onToggleEditing(event)} />
          <FontAwesomeIcon className="iconEdit" icon={faTrash} onClick={(event) => this.onDelete(event)} />
        </div>
      </div>
    );
  }

  renderEdit() {
    return (
      <form onSubmit={this.onSubmit} className="userEditForm">
        <div className="userTableRow">
          <div className="userTableCell userTableCellName"><input className="userEditInput userEditInputName" type="text" placeholder="Full name" value={this.state.name} onChange={(event) => this.onNameEdit(event)} /></div>
          <div className="userTableCell userTableCellEmail"><input className="userEditInput userEditInputEmail" type="text" placeholder="E-mail address" value={this.state.email} onChange={(event) => this.onEmailEdit(event)} /></div>
          <div className="userTableCell userTableCellPhone"><input className="userEditInput userEditInputPhone" type="text" placeholder="Phone number" value={this.state.phone} onChange={(event) => this.onPhoneEdit(event)} /></div>
          <div className="userTableCell userTableCellEdit">
            <input className="userEditInput userEditInputCancel" type="button" value="Cancel" onClick={(event) => this.onToggleEditing(event)} />
            <input className="userEditInput userEditInputSave" type="submit" value="Save" onClick={(event) => this.onSubmit(event)} />
          </div>
        </div>
      </form>
    );
  }

  render() {
    if (this.state.editing) {
      return this.renderEdit();
    }
    else {
      return this.renderView();
    }
  }
}

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { app: props.app }; 
  }

  render() {
    return (
      <div className="userTable">
        <div className="userTableRow">
          <div className="userTableHeader userTableHeaderName" onClick={() => this.props.app.sortBy('name')}>Name</div>
          <div className="userTableHeader userTableHeaderEmail" onClick={() => this.props.app.sortBy('email')}>E-mail address</div>
          <div className="userTableHeader userTableHeaderPhone" onClick={() => this.props.app.sortBy('phone')}>Phone number</div>
          <div className="userTableHeader userTableHeaderEdit"></div>
        </div>
        { this.props.data.map((user, key) => <UserRow app={this.props.app} name={user.name} email={user.email} phone={user.phone} id={user.id} key={key} />) }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      data: props.data, 
      sortOrder: 1, 
      sortKey: 'name'
    };

    this.onInsert = this.onInsert.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.compareBy = this.compareBy.bind(this);
  }

  onInsert(user) {
    var newData = this.state.data.concat({
      name: user.name, 
      email: user.email, 
      phone: user.phone, 
      id: this.getNextId()
    });

    this.setState({ data: newData });
  }

  onEdit(user) {
    var idx = this.findUserIndex(user.id);

    if (idx > -1) {
      this.setState({data: this.replaceArrayIndex(this.state.data, idx, user)});
    }
  }

  onDelete(user_id) {
    var idx = this.findUserIndex(user_id);

    if (idx > -1) {
      this.setState({data: this.removeArrayIndex(this.state.data, idx)});
    }
  }

  validateName(name) {
    return (name.length > 0);
  }

  validateEmail(email) {
    return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  }

  validatePhone(phone) {
    return phone.match(/^(?:(\+))?(?:[0-9]{0,3}[\s./-]?)?(?:(?:\((?=\d{3}\)))?(\d{3})(?:(?!\(\d{3})\))?[\s./-]?)?(?:(?:\((?=\d{3}\)))?(\d{3})(?:(?!\(\d{3})\))?[\s./-]?)?(?:(?:\((?=\d{4}\)))?(\d{4})(?:(?!\(\d{4})\))?[\s./-]?)?$/i);
  }

  validateUser(user) {
    var nameValid = this.validateName(user.name);
    var emailValid = this.validateEmail(user.email);
    var phoneValid = this.validatePhone(user.phone);

    if (!nameValid) {
      alert("Name cannot be empty!");
    }
    else if (!emailValid) {
      alert("Email is not correctly formatted");
    }
    else if (!phoneValid) {
      alert("Phone number is not correctly formatted");
    }

    return (nameValid && emailValid && phoneValid);
  }

  sortBy(sortKey) {
    var sortOrder = (this.state.sortKey === sortKey) ? (this.state.sortOrder * -1) : 1;
    var copyOfArray = this.state.data.slice(0);

    copyOfArray.sort(this.compareBy(sortKey, sortOrder));

    this.setState({ data: copyOfArray, sortOrder: sortOrder, sortKey: sortKey });
  }

  render() {
    return (
      <div className="pageContainer">
        <div className="pageHeader">
          <div className="companyInfo">
            <img className="companyLogo" src="logo.png" alt="Logo" />
            <span className="companyName">Nord Software</span>
          </div>
        </div>
        <div className="pageBody">
          <h1 className="pageTitle">List of participants</h1>
          <NewUserForm app={this} />
          <UserTable app={this} data={this.state.data} />
        </div>
      </div>
    );
  }

  compareBy(compareKey, sortOrder) {
    return function(a, b) {
      var result = 0;

      if (a[compareKey] < b[compareKey]) {
        result = -1;
      }

      if (a[compareKey] > b[compareKey]) {
        result = 1;
      }

      return (result * sortOrder);
    }
  }

  replaceArrayIndex(array, idx, obj) {
    array[idx] = obj;
    return array;
  }

  removeArrayIndex(array, idx) {
    array.splice(idx, 1);
    return array;
  }

  findUserIndex(user_id) {
    for (var i = 0; i < this.state.data.length; ++i) {
      if (user_id === this.state.data[i].id) {
        return i;
      }
    }

    return -1;
  }

  getNextId() {
    var compareFn = function(user) { 
      return user.id; 
    };

    return (1 + Math.max.apply(Math, this.state.data.map(compareFn)));
  }
}

export default App;
