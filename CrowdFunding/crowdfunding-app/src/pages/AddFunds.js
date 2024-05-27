import React, { Component } from 'react';
class AddPet extends Component {
    render() {
        return (
        <div id="content">
            <p> Total no of pets {this.props.petCount} </p>
            <h1>Add Pet </h1>
            <form onSubmit={(event) => {
                event.preventDefault()
                const name = this.petName.value
                const picName = this.petPic.value
                const age = this.petAge.value
                const breed = this.petBreed.value
                const location = this.petLocation.value                   
                const price = window.web3.utils.toWei(this.petPrice.value.toString(), 'ether')
                this.props.addPet(name, picName, age, breed, location, price)
            }}> {/*end of form */}
                <div className="form-group mr-sm-2">
                    <input
                        id="petName"
                        type="text"
                        ref={(input) => { this.petName = input }}
                        className="form-control"
                        placeholder="Pet Name"
                        required />
                </div>
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="petPic"
                        type="text"
                        ref={(input) => { this.petPic = input }}
                        className="form-control"
                        placeholder="Pet Picture"
                        required />
                </div>
                <br />
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="petAge"
                        type="text"
                        ref={(input) => { this.petAge = input }}
                        className="form-control"
                        placeholder="Pet Age"
                        required />
                </div>
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="petBreed"
                        type="text"
                        ref={(input) => { this.petBreed = input }}
                        className="form-control"
                        placeholder="Pet Breed"
                        required />
                </div>
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="petLocation"
                        type="text"
                        ref={(input) => { this.petLocation = input }}
                        className="form-control"
                        placeholder="Pet Location"
                        required />
                </div>
                <br />
                
                <br />
                <div className="form-group mr-sm-2">
                    <input
                        id="petPrice"
                        type="text"
                        ref={(input) => { this.petPrice = input }}
                        className="form-control"
                        placeholder="Pet Price"
                        required />
                </div>
                
                <br />
                <br />
                <button type="submit" className="btn btn-primary">Add Pet</button>
            </form>
        </div>
        )
    }
}

export default AddPet;

