const { assert } = require('chai')

const BeyondArt = artifacts.require('./Beyondart');

require('chai')
.use(require('chai-as-promised'))
.should()

contract ('BeyondArt', (accounts) => {
    let contract
    before (async () => {
        contract = await BeyondArt.deployed()
    })

    describe('deployment', async() => {
        it('deployed successfully', async() => {
            const address = contract.address;
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
        })

        it('name checked', async() => {
            const name = await contract.name()
            assert.equal(name, 'BeyondArt')
        })

        it('symbol checked', async() => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'bA')
        })
    })

    describe('mintng', async() => {
        it('creates a new token', async() => {
            const result = await contract.mint('https...1')
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', 'from the contract')
            assert.equal(event._to, accounts[0], 'to is msg.sender')
            await contract.mint('https...1').should.be.rejected;
        })
    })

    describe('indexing', async() => {
        it('lists BeyondArt',async() => {
            await contract.mint('https...2')
            await contract.mint('https...3')
            await contract.mint('https...4')
            const totalSupply = await contract.totalSupply()

            let result = []
            let BeyondArt
            for(i=1; i<=totalSupply; i++) {
                BeyondArt = await contract.beyondArt(i -1)
                result.push(BeyondArt)
            }

            let expected = ['https...1', 'https...2', 'https...3', 'https...4']
            assert.equal(result.join(','),expected.join(','))
        })
    })


})