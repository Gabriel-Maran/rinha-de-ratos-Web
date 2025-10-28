import { useState } from "react"
export default function BtnLogin({ button, acaoBtn }) {


    const txtBotao = 'Logar'

    return <button {...button}>{acaoBtn}</button>
}