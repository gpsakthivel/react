import React from "react";

// const Hello = () => {
//     return (
//         <div>
//             <h1>Hello sakthi</h1>
//         </div>
//     )
// }

const Hello = () => {
    return React.createElement(
        'div', 
        { id: 'hello', className: 'dummyClass'}, 
        React.createElement(
            'h1', 
            null, 
            'Hello sakthi'
        )
    );
}

export default Hello;