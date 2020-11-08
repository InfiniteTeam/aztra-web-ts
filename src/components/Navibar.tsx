import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import axios, { AxiosError } from 'axios'
import oauth2 from '../datas/oauth'
import urljoin from 'url-join'
import { User } from '../types/DiscordTypes'

interface NavibarState {
  user: User | null
  loginDone: boolean
}

export default class Navibar extends Component<{}, NavibarState> {
  state: NavibarState = {
    user: null,
    loginDone: false
  }

  getUserInfo = async (token: string) => {
    try {
      let res = await axios.get(urljoin(oauth2.api_endpoint, '/users/@me'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      this.setState({ user: res.data })
      localStorage.setItem('cached_user', JSON.stringify(res.data))
    }
    catch (_e) {
      const e: AxiosError = _e
      this.setState({ user: null })
      localStorage.removeItem('cached_user')
      e.response?.status === 401 && window.location.assign('/login')
    }
    finally {
      this.setState({ loginDone: true })
    }
  }

  componentDidMount() {
    console.log(localStorage.getItem('token'))
    const token = localStorage.getItem('token')
    !token || this.getUserInfo(token)
  }

  render() {
    const user = this.state.user || JSON.parse(localStorage.getItem('cached_user')!)
    return (
      <>
        <div style={{ paddingBottom: 57 }}>
          <Navbar bg="dark" expand="sm" fixed="top" className="nav-item no-drag navbar-dark">
            <Container fluid="sm">
              <Navbar.Brand href="/" style={{
                fontWeight: 500
              }}>
                Aztra
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="/" className="Navlink">
                    홈
                  </Nav.Link>
                  <Nav.Link href="/servers" className="Navlink">
                    대시보드
                  </Nav.Link>
                  <Nav.Link href="/premium" className="Navlink">
                    Aztra Premium
                  </Nav.Link>
                </Nav>
                <Nav>
                  {
                    user
                      ?
                      <>
                        <div style={{
                          justifyContent: 'left',
                          display: 'flex'
                        }}>
                          <img alt={user.username} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} style={{
                            maxHeight: 32,
                            borderRadius: '700%',
                            overflow: 'hidden',
                            marginRight: 5,
                            marginTop: 5
                          }} />
                          <NavDropdown title={`${user.username}#${user.discriminator}`} id="basic-nav-dropdown" className="dropdown-menu-dark" style={{
                            fontSize: '12.5pt'
                          }}>

                            <NavDropdown.Item className="dropdown-item-dark" href="/logout">
                              로그아웃
                            </NavDropdown.Item>
                          </NavDropdown>
                        </div>
                      </>
                      : <Nav.Link href="/login">로그인</Nav.Link>
                  }
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </>
    );
  }
}
