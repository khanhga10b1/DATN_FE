import Parking from "../assets/icons/parking.svg";
import Meal from "../assets/icons/food.svg";
import Elevator from "../assets/icons/elevator.svg";
import Pool from "../assets/icons/pool.svg";
import Wifi from "../assets/icons/wifi.svg";
import FirstAidKit from "../assets/icons/first-aid.svg";
import AirConditioner from "../assets/icons/air-conditioner.svg";
import HairDryer from "../assets/icons/hair-dryer.svg";

export const mappingAmenity = (amenity) => {
  let icon = Parking;
  switch (amenity) {
    case "First Aid Box":
      icon = FirstAidKit;
      break;
    case "Air Conditioner":
      icon = AirConditioner;
      break;
    case "Hair Dryer":
      icon = HairDryer;
      break;
    case "Parking":
      icon = Parking;
      break;
    case "Free Meal":
      icon = Meal;
      break;
    case "Elevator":
      icon = Elevator;
      break;
    case "Pool":
      icon = Pool;
      break;
    case "Wifi":
      icon = Wifi;
      break;
    default:
      icon = Parking;
      break;
  }
  return icon;
};
