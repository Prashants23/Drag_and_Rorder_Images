import { motion, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  CARD: "card"
};

const style = {
  border: "1px solid gray",
  height: "50px",
  width: "50px",
  borderRadius: "50%",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
  margin: "10px",
  overflow: "hidden"
};

export const Card = ({ id, text, index, moveCard }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      if (text === null) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      if (text === null) {
        return {};
      }
      return { id, index };
    },
    collect: (monitor) => {
      if (text === null) {
        return {};
      }
      return { isDragging: monitor.isDragging() };
    }
  });
  const opacity = isDragging ? 0 : 1;
  if (text !== null) {
    drag(drop(ref));
  }

  return (
    <motion.div
      layout
      ref={ref}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
    >
      <img src={text} alt="test" style={{ width: "50px", height: "50px" }} />
    </motion.div>
  );
};
