import Constants from "expo-constants";
import IUser from 'src/interfaces/IUser';
import {useState} from "react";
const useOneSignal = (user:IUser) => {
  const initialize = () => {

  }

  const destroy = () => {}

  return {
    initialize,
    destroy,
  }
}

export default useOneSignal
