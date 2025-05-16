import Topbar from "../components/topbar/topbar"
import './home.css'
import DatabaseIo from "./animations/database-io/databaseio"

function Home() {
    return (<>
        <div id="cell1">
            <Topbar />
            <div id="headers">
            <h1 id="t1">Tyto Database</h1>
            <h2 id="t2">A blazingly fast database</h2>
            </div>
            <DatabaseIo/>
        </div>
    </>)
}
export default Home