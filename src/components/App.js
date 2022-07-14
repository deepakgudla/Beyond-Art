import  React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import BeyondArt from '../abis/BeyondArt.json'
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn}from 'mdb-react-ui-kit';
import  './App.css';

class App extends Component {

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        const provider = await detectEthereumProvider();
            if(provider) {
                console.log('ethereum wallet is connected ')
                window.web3 = new Web3(provider)
            }
            else {
                console.log('no ethereum wallet detected')
            }
    }
//blockchain connection......
    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({account:accounts[0]})
        //console.log(this.state.account)
        const networkId = await web3.eth.net.getId()
        const networkData = BeyondArt.networks[networkId]
        if(networkData) {
            const abi = BeyondArt.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address)
            this.setState({contract})
           // console.log(this.state.contract);
            const totalSupply = await contract.methods.totalSupply().call()
            this.setState({totalSupply})

            for(let i=1; i <= totalSupply; i++) {
                const BeyondArt = await contract.methods.beyondArt(i - 1).call()
                this.setState({
                    beyondArt:[...this.state.beyondArt, BeyondArt]
                })
               
            }
                  
        }
        else {
            window.alert('smart contract not deployed')
        }

    }

            mint = (beyondArt) => {
                this.state.contract.methods.mint(beyondArt).send({from:this.state.account})
                .once('receipt', (receipt) => {
                    this.setState({
                      beyondArt:[...this.state.beyondArt, BeyondArt]
                    })
                })
            }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract:null,
            totalSupply:0,
            beyondArt:[]
        }
    }
    render() {
        return (
            <div className="container-filled">
                {console.log(this.state.beyondArt)}
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <div className="navbar-brand col-sm-3 col-md-3 mr-0"     style={{color:'white'}}>
                
                    BeYoNdArT NFT Collection 

                </div>
                <ul className="navbar-nav px-3"> 
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block" > 
                <small className="text-red">   wallet address -  {this.state.account} 
                </small>
                </li>
                </ul>
                </nav>
                <div className="container-fluid mt-1">
                    <div className="row">
                        <main role= 'main' className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto" style={{opacity:'1.7'}} >
                                <h1 style={{color: 'black'}}> BeYoNdArT  </h1>
                                <h6> <p> transforming art into digital art ✨</p></h6>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const beyondArt = this.beyondArt.value
                                    this.mint(beyondArt)

                                }}> 
                                    <input  
                                        type='text'
                                        placeholder="add file location"
                                        className="form-control mb-1"  //form control
                                        ref={(input) => this.beyondArt = input}
                                        />

                                        <input style={{margin:'5px'}}
                                            type='submit'
                                            className="btn btn-primary btn-black"
                                            value='mint'

                                        />
                                </form>


                            </div>

                        </main>

                    </div>
                        <hr></hr>
                        <div className='row textCenter'> 
                                {this.state.beyondArt.map((beyondArt, key ) =>{
                                    return (
                                        <div>
                                            <div>
                                                <MDBCard className="token img" style ={{maxWidth:'22rem'}} >
                                                <MDBCardImage src={beyondArt} position='top' height='250rem' style={{marginRight:'4px'}}/>
                                                <MDBCardBody>
                                                <MDBCardTitle> beyondArt </MDBCardTitle>
                                                <MDBCardText> this is an NFT that can be owned by a single person on the ethereum blockchain. Grab it soon before others  grab it</MDBCardText>
                                                <MDBBtn href={beyondArt}>  view </MDBBtn>
                                                </MDBCardBody>
                                                </MDBCard>

                                            </div>
                                        </div>
                                    )
                                })}
                        </div>

                </div>
            </div>
        )
    }
}
export default App;