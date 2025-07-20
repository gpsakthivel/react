import React from 'react'
import { useState } from 'react'

const Content = () => {
    const [items, setItems] = useState(
        [
            {
                id: 1,
                checked: true,
                item: "Practice Coding"
            },
            {
                id: 2,
                checked: true,
                item: "Practice Java"
            },
            {
                id: 3,
                checked: true,
                item: "Practice Spring"
            }
        ]
    )

    return (
        <main>
            <ul>
                {items.map((item) => (
                    <li>
                        <input 
                            type="text" />
                    </li>
                ))}
            </ul>
        </main>
    )
}

export default Content