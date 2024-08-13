import React from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../config/firebase'

const LeftSideBar = () => {

    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/profile');
    }

    return (
        <div className='ls'>
            <div className="ls-top">
                <div className="ls-nav">
                    <img src={assets.logo} alt="" className='logo' />
                    <div className="menu">
                        <img src={assets.menu_icon} alt="" />
                        <div className="sub-menu">
                            <p onClick={() => handleEditProfile()}>Edit Profile</p>
                            <hr />
                            <p onClick={() => logout()}>Logout</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assets.search_icon} alt="" />
                    <input type="text" placeholder='Search here...' />
                </div>
            </div>
            <div className="ls-list">
                {
                    Array(12).fill("").map((item, index) => (
                        <div key={index} className="friends">
                            <img src={assets.profile_img} alt="" />
                            <div>
                                <p>Dinesh Gosavi</p>
                                <span>Hello, Developer Dinesh</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default LeftSideBar
