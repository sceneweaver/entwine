import React from 'react'
import chai, {expect} from 'chai'
chai.use(require('chai-enzyme')())
import {shallow} from 'enzyme'
import {spy} from 'sinon'
chai.use(require('sinon-chai'))
import {createStore} from 'redux'

import LoginContainer, {Login} from './Login'

/* global describe it beforeEach */
describe('<Login />', () => {
  let root
  beforeEach('render the root', () =>
    root = shallow(<Login/>)
  )

  it('shows a login form', () => {
    expect(root.find('input[name="username"]')).to.have.length(1)
    expect(root.find('input[name="password"]')).to.have.length(1)
  })

  it('shows a password field', () => {
    const pw = root.find('input[name="password"]')
    expect(pw).to.have.length(1)
    expect(pw.at(0)).to.have.attr('type').equals('password')
  })

  it('has a login button', () => {
    const submit = root.find('[type="submit"]')
    expect(submit).to.have.length(1)
  })

// Need to refactor to work with new Login component
//   describe('when submitted', () => {
//     const login = spy()
//     const root = shallow(<Login login={login}/>)
//     const submitEvent = {
//       preventDefault: spy(),
//       target: {
//         username: {value: 'bones@example.com'},
//         password: {value: '12345'},
//       }
//     }

//     beforeEach('submit', () => {
//       login.reset()
//       submitEvent.preventDefault.reset()
//       root.find('[type="submit"]').simulate('click', submitEvent);
//       // root.simulate('submit', submitEvent)
//     })

//     it('calls props.login with credentials', () => {
//       expect(login).to.have.been.calledWith(
//         submitEvent.target.username.value,
//         submitEvent.target.password.value,
//       )
//     })

//     it('calls preventDefault', () => {
//       expect(submitEvent.preventDefault).to.have.been.called
//     })
//   })
// })

describe("<Login/>'s connection", () => {
  const state = {
    msg: 'Log in'
  }

  let root, store, dispatch
  beforeEach('create store and render the root', () => {
    store = createStore(state => state, state)
    dispatch = spy(store, 'dispatch')
    root = shallow(<LoginContainer store={store}/>)
  })

  it('gets msg from mapState during connection', () => {
    expect(root.find(Login)).to.have.prop('message').eql(state.msg)
  })
})

