import { useParams } from "react-router-dom";
import './docs.css';
import Topbar from "../components/topbar/topbar";
import { useEffect } from "react";

function Docs() {
    useEffect(() => {
        const highlight = () => window.hljs && window.hljs.highlightAll();
        setTimeout(highlight, 500); // Wait 500ms
        const interval = setInterval(highlight, 100);
        
        const content = document.getElementById('content');
        const headings = document.querySelectorAll('h2[id], h3[id]');
        const observer = new IntersectionObserver(
            (entries) => {
                const intersectingEntries = entries.filter(entry => entry.isIntersecting);
                if (intersectingEntries.length > 0) {
                    const topEntry = intersectingEntries.reduce((prev, current) => {
                        return (prev.boundingClientRect.top < current.boundingClientRect.top) ? prev : current;
                    });
                    const activeId = topEntry.target.getAttribute('id');
                    document.querySelectorAll('#sidebar a').forEach((link) => link.classList.remove('active'));
                    const activeLink = document.querySelector(`#sidebar a[href="#${activeId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            },
            {
                root: content,
                threshold: 0.1,
                rootMargin: '0px 0px -90% 0px'
            }
        );
        headings.forEach((heading) => observer.observe(heading));

        const handleClick = (e) => {
            e.preventDefault();
            const id = e.target.getAttribute('href').slice(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };
        const links = document.querySelectorAll('#sidebar a');
        links.forEach((link) => {
            link.addEventListener('click', handleClick);
        });

        return () => {
            clearInterval(interval);
            headings.forEach((heading) => observer.unobserve(heading));
            links.forEach((link) => {
                link.removeEventListener('click', handleClick);
            });
        };
    }, []);

    return (
        <>
            <Topbar />
            <div id="docs-content-holder">
                <div id="sidebar">
                    <ul>
                        <li><a href="#introduction">Introduction</a></li>
                        <li><a href="#installation">Installation</a></li>
                        <li>
                            <a href="#containers">Containers</a>
                            <ul>
                                <li><a href="#headers">Headers</a></li>
                                <li><a href="#row-structure">Row structure</a></li>
                                <li><a href="#indexes">Indexes</a></li>
                                <li><a href="#mvcc">MVCC</a></li>
                                <li><a href="#schemas">Schemas</a></li>
                            </ul>
                        </li>
                        <li><a href="#strix">Strix</a></li>
                        <li>
                            <a href="#alba-language">Alba Language</a>
                            <ul>
                                <li><a href="#basic-syntax">Basic syntax</a></li>
                                <li><a href="#creating-instances">Creating instances</a></li>
                                <li><a href="#editing-instances">Editing instances</a></li>
                                <li><a href="#deleting-instances">Deleting instances</a></li>
                                <li><a href="#condition-operators">Condition operators</a></li>
                                <li><a href="#queries">Queries</a></li>
                                <li><a href="#transactions">Transactions</a></li>
                                <li><a href="#security">Security</a></li>
                                <li><a href="#networking">Networking</a></li>
                                <li><a href="#file-structure">File structure</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div id="content">
                    <div id="inner-content">
                        <h1 id="tytodb-documentation">TytoDB Documentation</h1>

                        <section>
                            <h2 id="introduction">Introduction</h2>
                            <p>TytoDB, Tyto Database, or just Tyto is a relational database focused strictly on performance, regardless of the sacrifices, but we also intend to give the database operator options to handle his use case, mitigating or avoiding the consequences of the sacrifices made for performance.</p>
                        </section>

                        <section>
                            <h2 id="installation">Installation</h2>
                            <p>You can install the database by making a git clone into the database repository, but it is not advisable, the database is not ready for production yet and the QA(Quality assurance) tests are not done yet, specially because I will make some updates and implement some features before releasing the first version, ensuring that this first version get as battle tested as I consider coherent.</p>
                        </section>

                        <section>
                            <h2 id="containers">Containers</h2>
                            <p>In TytoDB, all the data are stored in a container, which contains files containing all the inserted rows (and all row gravestones, if any). This field covers the container topic, explaining its headers and how it stores, writes, edits, and deletes row data.</p>

                            <h3 id="headers">Headers</h3>
                            <p>Container headers hold two fixed-sized arrays, one with the column names and another with the column type ID, so the database can understand the structure of the container when loading it. As mentioned earlier, headers are composed of fixed-size arrays, which are defined by some properties. First, the column names, and their size are determined by the max_columns property in settings and the constant MAX_STR_LEN in the code, which is not editable, since changing it is not reasonable even in edge cases since a container name most times if not all times don&apos;t have to be greater than 100. The second property that influences the header&apos;s size is the type definitions fixed-size array, which holds the definition of types each column holds, its size in bytes is equal to the max_columns property since each type definition is held by a u8 (has a size of 1 byte).</p>

                            <h3 id="row-structure">Row structure</h3>
                            <p>Every row is stored as a fixed-size array inside its container, with its size being exactly the sum of all the types of sizes in the row. There are 10+ types available for storing various sorts of data, all having a strict size, besides the TEXT type, which is flexible. Below you can read about each type, each description explaining its properties and examples of in which contexts you should use each one, so the decision of what types to choose can be made as wisely as possible.</p>
                            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type Name</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Size</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Capacity</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>BIGINT</td>
                                        <td style={{ padding: '8px' }}>An integer great for storing IDs.</td>
                                        <td style={{ padding: '8px' }}>8 bytes</td>
                                        <td style={{ padding: '8px' }}>-2^63 to (2^63)-1</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>INT</td>
                                        <td style={{ padding: '8px' }}>An integer better for general numerical values.</td>
                                        <td style={{ padding: '8px' }}>4 bytes</td>
                                        <td style={{ padding: '8px' }}>-2^31 to (2^31)-1</td>
                                        <td style={{ padding: '8px' }}>Also suitable for IDs.</td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>FLOAT</td>
                                        <td style={{ padding: '8px' }}>A floating point number for calculations and finance/statistics data.</td>
                                        <td style={{ padding: '8px' }}>8 bytes</td>
                                        <td style={{ padding: '8px' }}>Same range as BIGINT with floating points</td>
                                        <td style={{ padding: '8px' }}>Not recommended for storing currency.</td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>BOOL</td>
                                        <td style={{ padding: '8px' }}>A boolean value (true/false).</td>
                                        <td style={{ padding: '8px' }}>1 byte</td>
                                        <td style={{ padding: '8px' }}></td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>TEXT</td>
                                        <td style={{ padding: '8px' }}>Stores texts of any length in a foreign file.</td>
                                        <td style={{ padding: '8px' }}>Varies</td>
                                        <td style={{ padding: '8px' }}>Unlimited</td>
                                        <td style={{ padding: '8px' }}><em>[DEPRECATED]</em> Not recommended due to performance issues and unexpected behavior.</td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>NONE</td>
                                        <td style={{ padding: '8px' }}>Stores nothing.</td>
                                        <td style={{ padding: '8px' }}>0 bytes</td>
                                        <td style={{ padding: '8px' }}></td>
                                        <td style={{ padding: '8px' }}>Don’t use it.</td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>CHAR</td>
                                        <td style={{ padding: '8px' }}>Stores a single character.</td>
                                        <td style={{ padding: '8px' }}>Up to 4 bytes</td>
                                        <td style={{ padding: '8px' }}>1 character</td>
                                        <td style={{ padding: '8px' }}>Uses Rust char type, hence 4 bytes.</td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>NANO-STRING</td>
                                        <td style={{ padding: '8px' }}>Stores text data up to 10 characters.</td>
                                        <td style={{ padding: '8px' }}>18 bytes (64-bit) / 14 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>10 characters</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>SMALL-STRING</td>
                                        <td style={{ padding: '8px' }}>Stores text data up to 100 characters.</td>
                                        <td style={{ padding: '8px' }}>108 bytes (64-bit) / 104 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>100 characters</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>MEDIUM-STRING</td>
                                        <td style={{ padding: '8px' }}>Stores text data up to 500 characters.</td>
                                        <td style={{ padding: '8px' }}>508 bytes (64-bit) / 504 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>500 characters</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>BIG-STRING</td>
                                        <td style={{ padding: '8px' }}>Stores text data up to 2000 characters.</td>
                                        <td style={{ padding: '8px' }}>2008 bytes (64-bit) / 2004 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>2000 characters</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>LARGE-STRING</td>
                                        <td style={{ padding: '8px' }}>Stores text data up to 3000 characters.</td>
                                        <td style={{ padding: '8px' }}>3008 bytes (64-bit) / 3004 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>3000 characters</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>NANO-BYTES</td>
                                        <td style={{ padding: '8px' }}>Stores raw bytes up to 10 bytes.</td>
                                        <td style={{ padding: '8px' }}>18 bytes (64-bit) / 14 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>10 bytes</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>SMALL-BYTES</td>
                                        <td style={{ padding: '8px' }}>Stores raw bytes up to 1000 bytes.</td>
                                        <td style={{ padding: '8px' }}>1008 bytes (64-bit) / 1004 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>1000 bytes</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>MEDIUM-BYTES</td>
                                        <td style={{ padding: '8px' }}>Stores raw bytes up to 10000 bytes.</td>
                                        <td style={{ padding: '8px' }}>10008 bytes (64-bit) / 10004 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>10000 bytes</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>BIG-BYTES</td>
                                        <td style={{ padding: '8px' }}>Stores raw bytes up to 100000 bytes.</td>
                                        <td style={{ padding: '8px' }}>100008 bytes (64-bit) / 100004 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>100000 bytes</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                    <tr style={{ border: '1px solid #ddd' }}>
                                        <td style={{ padding: '8px' }}>LARGE-BYTES</td>
                                        <td style={{ padding: '8px' }}>Stores raw bytes up to 1000000 bytes.</td>
                                        <td style={{ padding: '8px' }}>1000008 bytes (64-bit) / 1000004 bytes (32-bit)</td>
                                        <td style={{ padding: '8px' }}>1000000 bytes</td>
                                        <td style={{ padding: '8px' }}></td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3 id="indexes">Indexes</h3>
                            <p>In TytoDB performance is prioritized regardless of everything, due to that principle the project has, indexing couldn’t be out of it. In Tyto, every single column in containers is indexed. Indexes work by storing in memory addresses of rows in groups that separate each column in a specific condition. That approach improves the search time of queries that intend to gather a small count of rows and not the entire container or a considerable percentage of it.</p>
                            <p>However, since storing the row address in groups of columns would use a huge amount of memory if nothing were done, I developed a memory usage mitigation that flexes the address in types of u8, u16, u32, u64, and usize. That can highly decrease memory usage, especially when the count of rows is under the u16::MAX (65,535).</p>

                            <h3 id="mvcc">MVCC (Multi-version concurrency control)</h3>
                            <p>For ensuring transactions in TytoDB, every container has its own MVCC, it works by storing a HashMap that uses the index in the container for addressing the data and then a structure that tells whether the row is deleted or not and the data of the row. When the database runs a COMMIT operation, whether from an execution (client) or itself (auto-commit), the database pushes the changes into the container.</p>

                            <h3 id="schemas">Schemas</h3>
                            <p>At this current version of Tyto, you cannot mutate the container’s schema, it is currently immutable. But in the next versions, it will be available and the schema mutation will be possible and this current field will be explored with the appropriate depth.</p>
                        </section>

                        <section>
                            <h2 id="strix">Strix</h2>
                            <p>Writes into disk are corruption-prone, to avoid that, Strix runs into all the locations in the container to determine whether a write has been made and checks if the data matches with a blake3 hash, if it does, then Strix does nothing, otherwise, Strix writes the correct data again and checks again until the data gets correctly written in disk. The only problem is that if the database or machine that the database is running on explodes/turns off out of nowhere the data can remain corrupted, but that is very unlikely to happen, even while, in future updates, I will improve strix to handle those unexpected cases.</p>
                        </section>

                        <section>
                            <h2 id="alba-language">Alba Language</h2>
                            <p>TytoDB is not an SQL database, it operates with its scripting language which is <strong>Alba</strong>, designed to be simple, verbose, and as fast as possible to parse. This field covers the commands currently available with Alba.</p>

                            <h3 id="basic-syntax">Basic syntax</h3>

                            <h4 id="strings">Strings</h4>
                            <p>Strings are declared by wrapping the intended content in &apos; or &quot;, both works.</p>

                            <h4 id="groups">Groups</h4>
                            <p>Groups are arrays, but in Alba. They are declared by opening and closing brackets, the content being inside those and separated by commas. Example <code className="language-alba">[&apos;hamburger&apos;,&apos;nice nice&apos;,123]</code></p>

                            <h4 id="sub-commands">Sub-commands</h4>
                            <p>Used for entering a command inside another, this is declared by opening and closing curly brackets. Example</p>
                            <pre><code className="language-alba">SEARCH [&apos;PIZZA&apos;] ON [(SEARCH [&apos;PIZZA&apos; ON &apos;MYCONTAINER&apos; WHERE &apos;PIZZA&apos; = &apos;tasty&apos;]</code></pre>

                            <h3 id="creating-instances">Creating instances</h3>
                            <p>Alba, alongside Tyto, creates instances like containers and rows using the command CREATE, it has dynamic arguments, those depending on the instance being created.</p>

                            <h4 id="creating-a-new-container">Creating a new container</h4>
                            <p>When creating a container using the CREATE command, it asks for 3 arguments, the first one being the container name, which must be a string, a group with strings (container&apos;s columns names), and then another group with the same length as the previous one containing type-keywords to specify the types of the given columns. Example:</p>
                            <pre><code className="language-alba">CREATE CONTAINER &apos;my_nice_container&apos; [&apos;my_name&apos;,&apos;my_age&apos;][SMALL-STRING,INT]</code></pre>

                            <h4 id="creating-a-new-row">Creating a new row</h4>
                            <p>When creating a row using the CREATE command, it asks for 3 arguments, the first one being a group with strings (container&apos;s columns names), a group with the same length as the previous one containing type keywords to specify the types of the given columns and the container name Example:</p>
                            <pre><code className="language-alba">CREATE ROW [&apos;my_name&apos;,&apos;my_age&apos;][&apos;John doe&apos;,9432] ON &apos;my_nice_container&apos;</code></pre>

                            <h3 id="editing-instances">Editing instances</h3>
                            <p>Whether you want to change the values or properties of an instance you must use the command EDIT. Currently, the only editable instance is ROW.</p>

                            <h4 id="editing-rows">Editing rows</h4>
                            <p>Whenever you want to change the value of a row, you must enter the keyword EDIT followed by a group with column names and another group with the values you want to assign to these columns in the row, enter the keyword ON followed by the container name in which the row you are editing is in. You can, and in most cases, you have to add conditions in your editing, if you don&apos;t you will edit all the rows in the container. To add these conditions you must enter the keyword WHERE followed by conditions. Example:</p>
                            <pre><code className="language-alba">EDIT ROW [&apos;my_name&apos;][&apos;Jane doe&apos;] ON &apos;my_nice_container&apos; WHERE &apos;my_name&apos; = &apos;John doe&apos;</code></pre>

                            <h3 id="deleting-instances">Deleting instances</h3>
                            <p>For deleting instances in Tyto you must use the keyword DELETE, which handles the deletion of rows and containers.</p>

                            <h4 id="deleting-rows">Deleting rows</h4>
                            <p>To delete rows, you must enter the DELETE keyword, the keyword ROW for specifying the instance you want to delete, a group with the columns it has, the keyword ON followed by the container name, and then WHERE to specify the conditions a row must match to be deleted. If there are no conditions, every row will be deleted. Example:</p>
                            <pre><code className="language-alba">DELETE ROW [&apos;my_name&apos;,&apos;my_age&apos;] ON &apos;my_nice_container&apos; WHERE &apos;my_name&apos; = &apos;Jane doe&apos;</code></pre>

                            <h4 id="deleting-containers">Deleting containers</h4>
                            <p>Deleting containers is very straightforward, just enter the DELETE keyword, CONTAINER to point that you want to delete a container and then its name. Example:</p>
                            <pre><code className="language-alba">DELETE CONTAINER &apos;my_nice_container&apos;</code></pre>

                            <h3 id="condition-operators">Condition operators</h3>
                            <p>Whenever you&apos;re declaring a condition for deleting, editing, or searching you must use the right operators for your task.</p>

                            <h4 id="universal-operators">Universal operators</h4>
                            <p>They work with all types</p>
                            <ul>
                                <li><code className="language-alba">=</code> and <code className="language-alba">==</code> are used to check for equality;</li>
                                <li><code className="language-alba">!=</code> is used to check whether a value is not equal to another.</li>
                            </ul>

                            <h4 id="numerical-values">Numerical values</h4>
                            <ul>
                                <li><code className="language-alba">&gt;</code> Is used to check whether a numerical value is greater than another</li>
                                <li><code className="language-alba">&gt;=</code> Is used to check if a value is greater or equal to another</li>
                                <li><code className="language-alba">&lt;</code> Is used to check whether a value is lower than another.</li>
                                <li><code className="language-alba">&lt;=</code> Is used to check whether a value is equal to or lower than another.</li>
                            </ul>

                            <h4 id="string-text-values">String/Text values</h4>
                            <ul>
                                <li><code className="language-alba">&amp;&gt;</code> Is used to check if a text value contains another one</li>
                                <li><code className="language-alba">&amp;&amp;&gt;</code> Is used to check whether a text value contains another one regardless of uppercase or lowercase characters</li>
                                <li><code className="language-alba">&amp;&amp;&amp;&gt;</code> Is used to operate regular expressions, the database relies on the rust regex crate, so, if you want more details about how it works check the crate’s website <a href="https://docs.rs/regex/latest/regex/">https://docs.rs/regex/latest/regex/</a></li>
                            </ul>

                            <h3 id="queries">Queries</h3>
                            <p>An important thing in relational databases is gathering data from it, for doing so with Tyto you must use the SEARCH keyword, followed by a group of the column names you want the data from the row. Then, you must enter the keyword ON and a group with strings or query sub-commands, strings being container names and sub-commands for searching in a query result. Example:</p>
                            <pre><code className="language-alba">SEARCH [&apos;FOOD&apos;] ON [&apos;FOODLIST&apos;,(SEARCH [&apos;tasty_food&apos;] ON [&apos;Fridge&apos;])] WHERE &apos;FOOD&apos; = &apos;Pizza&apos;</code></pre>

                            <h3 id="transactions">Transactions</h3>
                            <p>In a database, whenever you mutate a row, this isn’t applied directly to the files but entered in the MVCC, if you want to discard changes due to any reason, you can &quot;rollback&quot; or commit if you want to save changes to disk.</p>

                            <h4 id="rollback">Rollback</h4>
                            <p>To discard changes, you must use the command ROLLBACK. But this rollback all the containers, since no containers were specified. To specify one you must enter a string (container name) next to the keyword.</p>

                            <h4 id="commit">Commit</h4>
                            <p>To apply changes, you must use the command COMMIT. But this applies changes to all the containers since no containers were specified. To specify one you must enter a string (container name) next to the keyword.</p>

                            <h3 id="security">Security</h3>
                            <p>Tyto also has security protocols, the first and currently only one is ensuring the clients connecting to the database are allowed and expected to exist.</p>
                            <p>To connect with the database, the client must send a Blake3 hashed version of one of the available secrets the database holds in its &quot;.tytodb-keys&quot;. If the database recognizes the hash, it returns a session ID, and the connection is accepted.</p>
                            <p>After getting a session ID, the client is now able to send commands to the database run.</p>

                            <h3 id="networking">Networking</h3>
                            <p>The connection layer of the database uses HTTP, since it is a well-established method, with many if not all programming languages having support for it, which simplifies the development of connection handlers and clients. This protocol was chosen because it has a great performance in most cases and has great tools around it, but in the future I will develop a dedicated method using TCP to handle those connections, avoiding the HTTP overhead and removing some latency from the wheel.</p>

                            <h3 id="file-structure">File structure</h3>
                            <p>TytoDB is stored in the &quot;~/TytoDB&quot; directory, created after running the database for the first time. Alongside the main directory (&quot;~/TytoDB&quot;), it creates some files that ensure it works properly, those files are &quot;settings.yaml&quot;, &quot;containers.yaml&quot;, &quot;.tytodb-keys&quot; and &quot;~/TytoDB/rf&quot;.</p>

                            <h4 id="settings-yaml">Settings.yaml</h4>
                            <p>This one stores all the database settings, which are:</p>
                            <ul>
                                <li><strong>max_columns</strong>, a property that allows you to change the maximum count of columns your containers can have, this must be edited only before creating the first container, afterwards it will make the database interpret the older ones as corrupted since this property is required to the database load containers and make proper writes/reads into the container file.</li>
                                <li><strong>min_columns</strong>, unlike the max_columns property, this one is not required and non-critical, it is just a convenience for parsing the container creation, ensuring the database won&apos;t create containers without columns. You can change it, but there is no visible reason to.</li>
                                <li><strong>memory_limit</strong>, whether the database is gathering chunks from files, if coherent the database will limit the buffer size to a maximum defined by this property. However, it does not limit the total memory usage of the database.</li>
                                <li><strong>auto_commit</strong>, does exactly what is on the property name, if there are no errors during a write operation, it will trigger the database to commit the changes. I don&apos;t think that should be done in most cases since it takes the control out of the database operator, but there is an option for doing so.</li>
                                <li><strong>ip</strong> is the property that determines the host your database will be used for handling the network traffic, having a default of localhost(127.0.0.1)</li>
                                <li><strong>data_port</strong> is the port that your database will be using</li>
                                <li><strong>connections_port</strong> stands for nothing, the database doesn&apos;t use it anymore.</li>
                                <li><strong>secret_key_count</strong>, when there are no &quot;.tytodb_keys&quot; a new file with the exact same name will be generated with base64 encoded secret keys, which are used by connection handlers/clients for connecting to the database. When generating the file, the database generates secret keys to it which will have a count that is the value of this property.</li>
                                <li><strong>request_handling</strong> determines whether the database will handle requests synchronously or asynchronously.</li>
                            </ul>
                            <p>&quot;max_connection_requests_per_minute&quot;, &quot;max_data_requests_per_minute&quot;, &quot;on_insecure_rejection_delay_ms&quot; and &quot;safety_level&quot; are settings that are not currently being used, but in the next updates, they will be removed or properly implemented. The “max_connection_requests_per_minute” were planned to make a rate limiting on the connections, but that does not make much sense since only trusted sources will send requests to the database. “on_insecure_rejection_delay_ms” was a property that would control the count of delay a request would emulate before responding, done for making the brute-force harder to be done and it will be implemented next update. “safety_level” would have some values that controls the consequences for failed connection attempts or errors due to bad secret keys, likely blocking the IP and making it unable of accessing the database. That property will be implemented next update, but probably with a different behavior.</p>

                            <h4 id="containers-yaml">containers.yaml</h4>
                            <p>Contains a list of the created containers, which tells the database which container files must be loaded on startup.</p>

                            <h4 id="tytodb-keys">.tytodb-keys</h4>
                            <p>Stores the secret keys used for connection handling.</p>

                            <h4 id="tytodb-rf">~/TytoDB/rf</h4>
                            <p>Stores the text files related to the deprecated TEXT type.</p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Docs;