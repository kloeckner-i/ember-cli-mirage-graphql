const getFieldName = ({ alias, name }) =>
  alias && alias.value || name.value;

export default getFieldName;
