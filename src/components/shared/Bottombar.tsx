import {Link, useLocation} from "react-router-dom"
import {bottombarLinks} from "../../constants/index"

export default function Bottombar() {
    const {pathname} = useLocation()
    return (
        <section className='bottom-bar'>
            {bottombarLinks.map((link) => {
                const isActive = pathname === link.route
                return(
                    <Link to={link.route} key={link.label}
                    className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-2 p-2 transition`}>
                        <img src= {link.imgURL} alt={link.label} className= {`${isActive && 'invert-white'}`} width={20} height={20}/>
                        <p className="tiny-medium text-light-2"> {link.label} </p>
                    </Link>
                )
            })}
        </section>
    )
}
