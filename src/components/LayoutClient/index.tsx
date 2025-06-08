import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Slideshow from './SlideShow'

const IndexClient = () => {
    return (
        <div>
            <Header />
            <Slideshow/>
            <Outlet />
            <Footer />
        </div>
    )
}

export default IndexClient