import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Class Components
// class ClassComponent extends React.Component {
//     render() {
//         return <h2>Class Component</h2>
//     }
// }

const Card = ({ title }) => {
    const [count, setCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        console.log(`${title} has been liked: ${hasLiked}`);
    });

    return (
        <div className="card" onclick={() => setCount(count + 1)}>
            <h2>{title} <br/> {count}</h2>

            <button onClick={() => {setHasLiked(!hasLiked)}}>
                {hasLiked ? 'Liked' : 'Like'}
            </button>
        </div>
    )
}

const App = () => {

    return (
        <div className="card-container">
            <Card title="Star Wars" />
            <Card title="Avatar" />
            <Card title="The Lion King" />
        </div>
    )
}

export default App
