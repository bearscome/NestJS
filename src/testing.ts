import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  // 커스텀 데코레이션 예제
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: "NotIn",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          // console.warn("property", property);
          // console.log("validationOptions", validationOptions);
          // console.log("object", object);
          // console.log("propertyName", propertyName);
          // console.log("value", value);
          // console.log("args", args);

          return (
            typeof value === "string" &&
            typeof relatedValue === "string" &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
