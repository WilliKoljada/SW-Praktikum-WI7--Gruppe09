from src.server.bo import BusinessObject as bo



class Projektarbeit (bo):

    def __init__(self):
        super().__init__()
        self._bezeichnung = ""


    def get_bezeichnung(self):
        return self._bezeichnung

    def set_bezeichnung(self, value):
        self._bezeichnung = value

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Projektarbeit()
        obj.set_id(dictionary["id"])
        obj.set_creation_time(Projektarbeit.date_format(dictionary["creation_time"]))
        obj.set_bezeichnung(Projektarbeit.date_format(dictionary["bezeichnung"]))