export const getProps = (props) => {
	return {
		shadow: props.shadow ? props.shadow : true,
		rounded: props.rounded ? props.rounded : false,
		background: props.background ? props.background : "#FFF",
	};
};
