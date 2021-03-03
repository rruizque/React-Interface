import React, { Component } from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

import { findIndex, without } from 'lodash';

class App extends Component {

  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 0      // to have keys in the array
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    });
  }

  searchApts(query) {
    this.setState({queryText: query});
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    });
  }

  updateInfo(name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {     // findIndex is a methid form lodash
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    this.setState({ myAppointments: tempApts });
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId= this.state.lastIndex;
    tempApts.unshift(apt);  // arr.unshift(element) pushes the element infront of the array arr
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    });
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;   // you can't modify myAppointments directly, need a variable(tempApts)
    tempApts = without(tempApts, apt);   //"without" is a method from loadash, returns the array (first parameter) without an element (second paramter)

    this.setState({             // setting the state. Inorder to use "this" here, you need to bind it, see line 18
      myAppointments: tempApts
    });
  }

  componentDidMount() {
    fetch('./data.json')
    .then(response => response.json())    // the response you are going to get is in json format
    .then(result => {         // Now we can work with the response sent (result).
      const apts = result.map(item => {   // pushing the response into a variable  "apts" to not modify the state directly 
        item.aptId = this.state.lastIndex;  // to have unique IDs in the object (keys)
        this.setState({ lastIndex: this.state.lastIndex + 1 });
        return item;
      })
      this.setState({
        myAppointments: apts
      });
    });
  }

  render() {

    let order;
    let filteredApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc') {
      order = 1;
    }else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => {
      if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()) {
        return -1 * order;
      }else {
        return 1 * order;
      }
    }).filter(eachItem => {
      return(
        eachItem['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase())
      )
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder = {this.changeOrder}
                  searchApts = {this.searchApts}
                />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo= {this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

}

export default App;
