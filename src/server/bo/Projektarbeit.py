from server.bo import BusinessObject as bo



class Projektarbeit (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._bezeichnung = ""


    def get_bezeichnung(self):
        return self._bezeichnung

    def set_bezeichnung(self, bezeichnung):
        self._bezeichnung = bezeichnung

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Projektarbeit()
        obj.set_id(dictionary["id"])
        obj.set_bezeichnung(dictionary["bezeichnung"])

        return obj
