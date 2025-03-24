export const deliveryOptions = [{
    id: '1',
    deliveryDays : 7,
    priceCent : 0,
}, {
    id: '2',
    deliveryDays : 5,
    priceCent : 499,
}, {
    id: '3',
    deliveryDays : 1,
    priceCent : 999,
}];

export function getDeliveryOption(deliveryOptionId){
    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });
    return deliveryOption || deliveryOption[0]; 
};