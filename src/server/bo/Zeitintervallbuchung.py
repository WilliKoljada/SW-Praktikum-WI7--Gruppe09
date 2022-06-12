from server.bo import BusinessObject as bo



class Zeitintervallbuchung (bo.BusinessObject):

    def __init__(self):
        super().__init__()


    # Buchung aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Zeitintervallbuchung()
        obj.set_id(dictionary["id"])

        return obj