from server.bo import BusinessObject as bo



class Ereignisbuchung (bo.BusinessObject):

    def __init__(self):
        super().__init__()


    # Buchung aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Ereignisbuchung()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(dictionary["creation_date"])

        return obj