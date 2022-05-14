import { useEffect, useState } from 'react'

const useTimer = () => {
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let interval:any = null;
    
    if(started) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }

    return () => {
      setTimer(0);
      clearInterval(interval);
    }
  }, [started]);

  return {
    timer,
    setStarted,
  }
}

export default useTimer