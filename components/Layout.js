import Navbar from './Navbar'
import Head from 'next/head';

/* Layout with <Head> where we can link to stylesheets and Font Awesome CDN 
                and <Navbar> */
const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="../public/style.css" />
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
            </Head>
            <Navbar />
            {children}
        </>
    )
}

export default Layout