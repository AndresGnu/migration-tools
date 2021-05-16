import {
  MigrationBuilder,
  PgType,
  ColumnDefinitions,
  ColumnDefinition,
} from 'node-pg-migrate';
// Columns
interface CodeNameOptions {
  codePk: boolean;
  lengthCode: number;
  isNullName: boolean;
}

// export
export const useHelperColumns = (pgm: MigrationBuilder) => {
  // Types
  const character = (number?: number) =>
    `${PgType.CHARACTER_VARYING}${number ? '(' + number + ')' : ''}`;
  const numeric = (presicion?: number, scale?: number) =>
    `${PgType.NUMERIC}${
      presicion ? `(${presicion} ${scale ? ',' + scale : ''})` : ''
    }`;

  const codeName = ({
    lengthCode,
    codePk,
    isNullName,
  }: CodeNameOptions): ColumnDefinitions => {
    return {
      code: codePk
        ? {
            type: character(lengthCode),
            primaryKey: true,
          }
        : {
            type: character(lengthCode),
            notNull: true,
            unique: isNullName || true,
          },
      name: {
        type: character(140),
        unique: isNullName || true,
      },
    };
  };
  //
  const idBigSerial = (): ColumnDefinition => {
    return {
      type: PgType.BIGSERIAL,
      primaryKey: true,
    };
  };
  const idSerial = (): ColumnDefinition => {
    return {
      type: PgType.SERIAL,
      primaryKey: true,
    };
  };

  const timestamp = (isDefault = false): ColumnDefinition => {
    const object = {
      type: PgType.TIMESTAMP_WITH_TIME_ZONE,
      default: pgm.func('NOW()'),
    };
    if (!isDefault) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      delete object.default;
    }
    return object;
  };

  return {
    $types: { character, numeric },
    $columns: {
      codeName,
      idBigSerial,
      idSerial,
      timestamp,
    },
  };
};

export type UseHelperColumns = typeof useHelperColumns;
export type HelperColumns = ReturnType<UseHelperColumns>;
