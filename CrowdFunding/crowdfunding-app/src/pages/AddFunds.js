import React, { Component } from 'react';
class AddFund extends Component {
    render() {
        return (
        <div id="content">
            <p> Total no of funds {this.props.fundCount} </p>
            <h1>Add Fund </h1>
            <form onSubmit={(event) => {
                event.preventDefault()
                const name = this.fundName.value
                const picName = this.fundPic.value                  
                const price = window.web3.utils.toWei(this.fundPrice.value.toString(), 'ether')
                this.props.addFund(name, picName, price)
            }}> {/*end of form */}
                <div className="form-group mr-sm-2">
                    <input
                        id="fundName"
                        type="text"
                        ref={(input) => { this.fundName = input }}
                        className="form-control"
                        placeholder="Fund Name"
                        required />
                </div>
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="fundPic"
                        type="text"
                        ref={(input) => { this.fundPic = input }}
                        className="form-control"
                        placeholder="Fund Picture"
                        required />
                </div>
                <br />
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="fundPrice"
                        type="text"
                        ref={(input) => { this.fundPrice = input }}
                        className="form-control"
                        placeholder="Fund Price"
                        required />
                </div>
                
                <br />
                <br />
                <button type="submit" className="btn btn-primary">Add Fund</button>
            </form>
        </div>
        )
    }
}

export default AddFund;

