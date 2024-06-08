import React, { Component } from 'react';

class AddFunds extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' }; // Add state for message
  }

  render() {
    const { message } = this.state; // Destructure message from state

    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow p-3 mb-5 bg-white rounded">
          <p> Total no of Campaign {this.props.fundsCount} </p>
          <h1>Add Campaign </h1>
          {message && <p className="alert alert-success">{message}</p>} {/* Display message if it exists */}
          <form onSubmit={async (event) => {
            event.preventDefault();
            const name = this.fundsName.value;
            const picName = this.fundsPic.value;
            const price = window.web3.utils.toWei(this.fundsPrice.value.toString(), 'ether');

            try {
              await this.props.addFunds(name, picName, price);
              this.setState({ message: 'Campaign added successfully!' }); // Set success message
            } catch (error) {
              console.error('Error adding campaign:', error);
              this.setState({ message: 'Error adding campaign, please try again.' }); // Set error message
            }
          }}>
            <div className="form-group">  {/* Group all inputs */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    id="fundsName"
                    type="text"
                    ref={(input) => { this.fundsName = input }}
                    className="form-control"
                    placeholder="Fund Name"
                    required
                  />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                  <input
                    id="fundsPic"
                    type="text"
                    ref={(input) => { this.fundsPic = input }}
                    className="form-control"
                    placeholder="Fund Picture"
                    required
                  />
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    id="fundsPrice"
                    type="text"
                    ref={(input) => { this.fundsPrice = input }}
                    className="form-control"
                    placeholder="Fund Price"
                    required
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Campaign</button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddFunds;