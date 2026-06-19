import { Schema, Types } from 'mongoose';

/**
 * Reusable Mongoose plugin to automatically cast specified string fields (including nested and array fields) to ObjectIds before saving.
 */
export const autoConvertObjectIdsAsync = (fields: string[]) => {
  return (schema: Schema<any, any, any>) => {
    schema.pre<any>('save', async function (this: any) {
      const doc = this;

      for (const fieldPath of fields) {
        const val = doc.get(fieldPath);

        if (val === '' || val === null) {
          doc.set(fieldPath, undefined); 
          continue;
        }

        if (val && typeof val === 'string') {
          if (Types.ObjectId.isValid(val)) {
            doc.set(fieldPath, new Types.ObjectId(val));
          } else {
            throw new Error(`Invalid ObjectId format provided for field "${fieldPath}": ${val}`);
          }
          continue;
        }

        if (fieldPath.includes('.')) {
          const [arrayKey, subFieldKey] = fieldPath.split('.');
          const arrayData = doc.get(arrayKey);

          if (Array.isArray(arrayData)) {
            arrayData.forEach((item: any) => {
              const subVal = item[subFieldKey];
              
              if (subVal === '' || subVal === null) {
                delete item[subFieldKey];
              } else if (subVal && typeof subVal === 'string') {
                if (Types.ObjectId.isValid(subVal)) {
                  item[subFieldKey] = new Types.ObjectId(subVal);
                } else {
                  throw new Error(`Invalid ObjectId format provided for subfield "${fieldPath}": ${subVal}`);
                }
              }
            });
            doc.markModified(arrayKey);
          }
        }
      }
    });
  };
};
