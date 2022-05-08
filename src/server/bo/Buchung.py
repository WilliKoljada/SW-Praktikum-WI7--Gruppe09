from src.server.bo import BusinessObject as bo


# Buchung Invitation Klasse
class Buchung (bo.BusinessObject):

    def __init__(self):
        super().__init__()


    # Buchung aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Buchung()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(dictionary["creation_date"])

        return obj