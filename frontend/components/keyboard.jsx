import Key from "./key.jsx";
import "../styles/variable.css";
import "../styles/keyboard.css";


const ROWS = [ //TODO: thinking of making this dynamic in the future 
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", "Shift"],
  ["Control", "Alt", "Spacebar", "Alt", "Control"],
];

export default function Keyboard() {

  return (
    <div className="kb-wrapper"> 
      {ROWS.map((row) => (
        <div className="kb-row">
          {row.map((letter) => (
            <Key
              letter={letter}
            />
          ))}
        </div>
      ))}
    </div>
  );
}