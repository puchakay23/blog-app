import React from 'react'
import {formatISO9075} from "date-fns"

const Post = () => {
    return (
        <div className="post">
            <div className="image">
                
                    <img src="https://tse2.mm.bing.net/th?id=OIP.vheSMYN2ZYwI7g_ZxlfezgHaE-&pid=Api&P=0&h=180" alt="" />
                
            </div>
            <div className="texts">
                
                    <h2>test</h2>
                
                <p className="info">
                    <a href="" className="author">Rishi</a>
                    <time>23-.4-2005 18:45</time>
                </p>
                <p className="summary">hello everyone</p>
            </div>
        </div>
    )
}

export default Post