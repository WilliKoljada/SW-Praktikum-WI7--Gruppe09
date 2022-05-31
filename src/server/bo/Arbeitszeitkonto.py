from src.server.bo import BusinessObject as bo


class Arbeitszeitkonto(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._arbeitspensum = 0.0

    def get_arbeitspensum (self):
        return self._arbeitspensum

    def set_arbeitspensum (self, arbeitspens):
        self._arbeitspensum = arbeitspens
    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Suggestion()."""
        obj = Arbeitszeitkonto()
        obj.set_arbeitspensum('arbeitspen')
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_creation_date(dictionary["creation_date"])



        return obj