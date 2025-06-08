import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Slideshow from './SlideShow'
import Gallery from './Gallery'

const IndexClient = () => {
    return (
        <div>
            <Header />
            <Slideshow/>
            <Outlet />
            <Gallery/>
            <Footer />
        </div>
    )
}

export default IndexClient