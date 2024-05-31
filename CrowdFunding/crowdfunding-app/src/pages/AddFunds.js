import React, { Component } from 'react';
class AddFunds extends Component {
    render() {
        return (
        <div id="content">
            <p> Total no of funds {this.props.fundsCount} </p>
            <h1>Add Fund </h1>
            <form onSubmit={(event) => {
                event.preventDefault()
                const name = this.fundsName.value
                const picName = this.fundsPic.value                  
                const price = window.web3.utils.toWei(this.fundsPrice.value.toString(), 'ether')
                this.props.addFunds(name, picName, price)
            }}> {/*end of form */}
                <div className="form-group mr-sm-2">
                    <input
                        id="fundsName"
                        type="text"
                        ref={(input) => { this.fundsName = input }}
                        className="form-control"
                        placeholder="Fund Name"
                        required />
                </div>
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="fundsPic"
                        type="text"
                        ref={(input) => { this.fundsPic = input }}
                        className="form-control"
                        placeholder="Fund Picture"
                        required />
                </div>
                <br />
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="fundsPrice"
                        type="text"
                        ref={(input) => { this.fundsPrice = input }}
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

export default AddFunds;

