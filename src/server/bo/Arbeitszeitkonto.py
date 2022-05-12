from server.bo.BusinessObject import BusinessObject as bo


class Arbeitszeitkonto(bo):

    def __init__(self):
        super().__init__()
        self._arbeitszeitkonto_id = 0



    def set_arbeitszeitkonto_id(self, arbeitszeitkonto_id):
        self._arbeitszeitkonto_id = arbeitszeitkonto_id

    def get_arbeitszeitkonto_id(self):
        return self._arbeitszeitkonto_id


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Suggestion()."""
        obj = Arbeitszeitkonto()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        #obj.set_name(dictionary["name"])                    # Teil von BO
        obj.set_arbeitszeitkonto_id(dictionary["arbeitszeitkonto_id"])


        return obj