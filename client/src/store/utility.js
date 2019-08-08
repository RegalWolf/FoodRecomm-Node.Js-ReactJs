export const updateObject = (oldObject, UpdatedProperties) => {
  return {
    ...oldObject,
    ...UpdatedProperties
  };
};