import React, { useRef, useEffect } from "react";
import JAZZ from "@metamask/jazzicon";

export default function Jazzicon({ size = 10, user }) {
  const divRef = useRef(null);
  const seed = user?.uid
    ? toPseudoRandomInteger(user.uid)
    : Math.floor(100000 + Math.random() * 900000);
  const result = JAZZ(size, seed);

  useEffect(() => {
    if (!divRef || !divRef.current) return null;

    divRef.current.appendChild(result);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="flex" ref={divRef} />;
}

function toPseudoRandomInteger(uidString = "") {
  var numberArray = [uidString.length];
  for (var i = 0; i < uidString.length; i++) {
    numberArray[i] = uidString.charCodeAt(i);
  }

  return numberArray.reduce((a, b) => a + b, 0);
}
