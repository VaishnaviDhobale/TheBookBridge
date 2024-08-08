
import styles from "./Slider.module.css"
export const Slider = ({ sliderValue, min, max, setSliderValue }) => {
  return (
    <div className={styles.container}>
      <p className={styles.value}>{sliderValue}</p>
      <div className={styles.sliderContainer}>
        <p>{min}</p>
        <input
          type="range"
          name=""
          id=""
          defaultValue={sliderValue}
          onChange={(event)=>{setSliderValue(event.target.value)}}
          min={min}
          max={max}
        />
        <p>{max}</p>
      </div>
    </div>
  );
};
