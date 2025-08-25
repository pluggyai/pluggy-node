export type AccountStatement = {
  /*! Primary identifier of the entity */
  id: string
  /*! Month and year of the account statement */
  monthYear: string
  /*! Signed URL to download the account statement file, valid for 30 minutes*/
  url: string
}
