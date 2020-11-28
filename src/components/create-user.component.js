import React, { Component } from 'react';
import axios from 'axios';
import { MDBDataTableV5 } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

// const User = props => (
//   <tr>
//     <td>{props.users._id}</td>
//     <td>{props.users.username}</td>
//     <td>{props.users.createdAt}</td>
//     <td>
//       <a href="#" onClick={() => { props.editUser(props.users._id) }}>edit</a> | <a href="#" onClick={() => { props.deleteUser(props.users._id) }}>delete</a>
//     </td>
//   </tr>
// )

export default class CreateUser extends Component {

  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.back = this.back.bind(this);
    
    this.state = {
      users: [],
      edit_user:[],
      show_user:[],
      username: '',
      status_edit: false,
      datatable: {
        columns: [],
        rows: [
          {
            id: '',
            username: '',
            created_at: '',
          },
        ]
      }
    }

    this.deleteUser = this.deleteUser.bind(this)
    this.editUser = this.editUser.bind(this)

    this.url = window.location.protocol + '//' + window.location.hostname + ':5000';
  }

  back(){
    this.setState({
      username: '',
      edit_user: [],
      status_edit: false,
    });
    console.log('clear!');
  }

  btnEditAndDelete(id){
    return <div><a href="#" onClick={() => { this.editUser(id) }}>edit</a> | <a href="#" onClick={() => { this.deleteUser(id) }}>delete</a></div>
  }

  btnSubmit(){
    if(this.state.status_edit){
      return <div>
              <input type="submit" value="Update User" className="btn btn-success" />&nbsp;
              <button className="btn btn-danger" onClick={this.back}>Back</button>
            </div>;
    }else{
      return <input type="submit" value="Create User" className="btn btn-primary" />;
    }
  }

  editUser(id) {
    axios.get(this.url+'/users/' + id)
      .then(res => {
        console.log('edit user: ', res.data.username);
        this.setState({
          username: res.data.username,
          edit_user: res.data,
          status_edit: true,          
        });
      });
      this.btnSubmit();
  }

  deleteUser(id) {
    axios.delete(this.url + '/users/' + id)
        .then(response => {
          console.log(response.data);
          this.setState({
            username: '',
            edit_user: [],
            status_edit: false,
            users: this.state.users.filter(el => el._id !== id)
          })
          this.componentDidMount();
        });
  }

  componentDidMount() {
    axios.get(this.url + '/users/')
        .then(response => {

          let element = [];
          for (let index = 0; index < response.data.length; index++) {
            let rows = {
              id: response.data[index]._id,
              username: response.data[index].username,
              createdAt: response.data[index].createdAt,
              actions: this.btnEditAndDelete(response.data[index]._id,), 
            }
            
            element.push(rows)
          }
  
          this.setState({ 
            users: response.data,
            datatable: {
              columns: [
                {
                  label: 'ID',
                  field: 'id',
                  width: 150,
                  attributes: {
                    'aria-controls': 'DataTable',
                    'aria-label': 'id',
                  },
                },
                {
                  label: 'Username',
                  field: 'username',
                  width: 270,
                },
                {
                  label: 'created at',
                  field: 'createdAt',
                  width: 200,
                },
                {
                  label: 'Actions',
                  field: 'actions',
                  width: 200,
                },
              ],
              rows: element            
            }
          })

        })
        .catch((error) => {
          console.log(error);
        })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    if(this.state.status_edit){
      const user = {
        username: this.state.username,
        user_edit: this.state.edit_user
      }
  
      // console.log(user);
  
      axios.post(this.url+'/users/update/' + this.state.edit_user._id, user)
        .then(res => {
          this.setState({
            username: '',
            edit_user: [],
            status_edit: false
          });
          console.log(res.data);
          this.componentDidMount();
        });
    }else{
      const user = {
        username: this.state.username
      }
  
      console.log(user);
  
      axios.post(this.url+'/users/add', user)
        .then(res => {
          this.setState({username: ''});
          console.log(res.data)
          this.componentDidMount();
        });
    }

  }

  // usersList() {
  //   return this.state.users.map(currentuser => {
  //     return <User users={currentuser} deleteUser={this.deleteUser} editUser={this.editUser} key={currentuser._id}/>;
  //   })
  // }

  render() {
    return (
      <div>
        <h3>Create New User</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group"> 
            <label>Username: </label>
            <input  type="text"
                required
                className="form-control"
                value={this.state.username}
                onChange={this.onChangeUsername}
                />
          </div>
          <div className="form-group">
            { this.btnSubmit() }
          </div>
        </form>
        {/* <hr/>
        <h3>Logged Users</h3>
        <table className="table">
          <thead className="thead-light">
              <tr>
                <th>_id</th>
                <th>username</th>
                <th>created at</th>
                <th>actions</th>
              </tr>
          </thead>
          <tbody>
              { this.usersList() }
          </tbody>
        </table> */}
        <hr/>
        <MDBDataTableV5 
        hover 
        entriesOptions={[5, 25, 100]} 
        entries={5} 
        pagesAmount={4} 
        data={this.state.datatable} 
        pagingTop
        searchTop
        searchBottom={false}
  
        />
      </div>
    )
  }
}