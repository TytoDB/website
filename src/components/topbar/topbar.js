import { useParams } from "react-router-dom"
import './topbar.css'

function Topbar(){
    const {section} = useParams()
    return (
    <div id="topbar">
        <img src="/TytoDB.png" className="logo"></img>
        <h1>TytoDB</h1>
        <div className="small-spacer" />
        <a className="topbar-a" href="/home">Home</a>
        <a className="topbar-a" href="/docs">Documentation</a>
        <div className="spacer" />
        <a href="https://discord.gg/pjsG8YrpM7" className="clogo-link" target="_blank"><img src="/Discord-Symbol-White.svg" className="clogo"></img></a>
        <a href="https://x.com/tytodatabase" className="clogo-link" target="_blank"><img src="/x.svg" className="clogo"></img></a>
        <a href="https://github.com/TytoDB" className="clogo-link" target="_blank"><img src="/github-mark-white.svg" className="clogo"></img></a>
    </div>
    )
}
export default Topbar