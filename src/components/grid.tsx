
import React, { useEffect, useRef, useState } from "react";
import "../App.css";

const defaultArr: ("O" | "X" | " ")[] = [" ", " ", " "];
let first = true;

export const Grid = () => {
    const [matrix, setMatrix] = useState<("O" | "X" | " ")[][]>([[...defaultArr], [...defaultArr], [...defaultArr]]);
    const [turn, setTurn] = useState<"X" | "O">(Math.random() > 0.5 ? "X" : "O");
    const [win, setWin] = useState<0 | 1 | 2 | 3>(0);
    const player1 = "X", player2 = "O";

    const x = useRef<HTMLInputElement>(null);

    const showPassword = () => {
        x.current!.type = x.current!.type === "password" ? "text" : "password";
    }

    const changeCell = (row: number, col: number) => {
        if(!win && matrix[row][col] === " "){
            matrix[row][col] = turn;
            setMatrix([...matrix]);
        }
    }

    const reset = () => {
        setMatrix([[...defaultArr], [...defaultArr], [...defaultArr]]);
        setWin(0);
    }

    const controlWin = () => {
        //Row:
        for(const arr of matrix){
            if(arr.every((val) => val === player1)) return player1;
            if(arr.every((val) => val === player2)) return player2;
        };   

        //Col:
        for(let i=0;i<matrix[0].length;i++){
            const tempArr = [];
            for(let j=0;j<matrix[1].length;j++){
                tempArr.push(matrix[j][i]);
            }
            if(tempArr.every((val) => val === player1)) return player1;
            if(tempArr.every((val) => val === player2)) return player2;
        }

        //Diagonal:
        const d1:("O" | "X" | " ")[] = [], d2:("O" | "X" | " ")[] = [];
        matrix.forEach((arr, row) => {
            arr.forEach((val, col) => {
                if((row === col)) d1.push(val);
                if((row+col === matrix[0].length-1)) d2.push(val);
            })
        });
        if(d1.every((val) => val === player1) || d2.every((val) => val === player1)) return player1;
        if(d1.every((val) => val === player2) || d2.every((val) => val === player2)) return player2;
        return " ";
    }

    useEffect(() => {
        const result = controlWin();
        if(result === player1) {
            setWin(1);
            setTimeout(() => reset(), 3000);
        }
        else if(result === player2) {
            setWin(2);
            setTimeout(() => reset(), 3000);
        }
        else if(matrix.every((arr) => arr.every((val) => val !== " "))) {
            setWin(3);
            setTimeout(() => reset(), 3000);
        }
        if(!first) setTurn(turn === "X" ? "O" : "X");
        else first = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matrix]);
    return (
        <>
        <input type="password" ref={x} />
        <button onClick={showPassword} >Show </button>
        <p className="fs-3">Player 1 use <span style={{color: "red"}}>{player1}</span>, Player 2 use <span style={{color: "red"}}>{player2}</span></p>
        <p className="fs-3">Player {turn === "X" ? 1 : 2} it's your turn</p>
        { win === 3 ? <p className="fs-3">Draw...</p> : win === 1 ? <p className="fs-3">Player 1 win!</p> : win === 2 ? <p className="fs-3">Player 2 win!</p> : null}
        <div className="game-board">
            {React.Children.toArray(matrix.map((arr, row) => {
                return arr.map((_, col) => {
                    return(<div className="box" onClick={() => changeCell(row, col)}>{matrix[row][col]}</div>);
                });
            }))}
        </div>
        <button type="button" className="btn btn-danger mt-3" onClick={() => reset()}>Reset</button>
        </>
    )
}
