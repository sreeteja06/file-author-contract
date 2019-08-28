/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Sunday, 25th August 2019 9:34:03 am
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
import React from 'react'
import { Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

const navbar = (props) => (
    <div>
        <Menu>
            <NavLink to="/">
            <Menu.Item
                name='notary'
                active={props.navItem === 'notary'}
            >
                Dig Notary
            </Menu.Item>
            </NavLink>
            <NavLink to='/digdocsign'>
            <Menu.Item
                name='digdocsign'
                active={props.navItem === 'digdocsign'}
            >
                Dig Doc Sign
            </Menu.Item>
            </NavLink>
        </Menu>
    </div>
)

export default navbar;