import { addOne } from "~/lib/example"
import React from "react"
import css from "~/css/styles.css"

export function Component() {
  return (
    <div className="sNEGkyOywTjA">
      <div className="container">
        <style>{css}</style>
        <h1>Hello World</h1>
        <p>Lucky number {addOne(6)}</p>
      </div>
    </div>
  )
}
