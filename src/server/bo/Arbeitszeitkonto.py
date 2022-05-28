from src.server.bo.BusinessObject import BusinessObject as bo


class Arbeitszeitkonto(bo):

    def __init__(self):
        super().__init__()


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Suggestion()."""
        obj = Arbeitszeitkonto()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_creation_date(dictionary["creation_time"])



        return obj