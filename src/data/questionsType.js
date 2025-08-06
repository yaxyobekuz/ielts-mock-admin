// Components
import Text from "../components/questions/Text";
import Flowchart from "../components/questions/Flowchart";
import RadioGroup from "../components/questions/RadioGroup";
import TextDraggable from "../components/questions/TextDraggable";

// Images
import textBg from "../assets/backgrounds/text-preview.jpg";
import flowchartBg from "../assets/backgrounds/flowchart-preview.jpg";
import radioGroupBg from "../assets/backgrounds/radiogroup-preview.jpg";
import textDraggableBg from "../assets/backgrounds/text-draggable-preview.jpg";

const questionsType = [
  {
    label: "Text",
    image: textBg,
    value: "text",
    component: Text,
  },
  {
    label: "Text draggable",
    image: textDraggableBg,
    value: "text-draggable",
    component: TextDraggable,
  },
  {
    label: "Flowchart",
    image: flowchartBg,
    value: "flowchart",
    component: Flowchart,
  },
  {
    label: "Radio group",
    image: radioGroupBg,
    value: "radio-group",
    component: RadioGroup,
  },
];

export default questionsType;
