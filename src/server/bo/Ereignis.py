from server.bo import BusinessObject as bo



class Ereignis (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._zeitpunkt_ereigniseintritt = ""

    def get_zeitpunkt_ereigniseintritt(self):
        return self._zeitpunkt_ereigniseintritt

    def set_zeitpunkt_ereigniseintritt(self, value):
        self._zeitpunkt_ereigniseintritt = value





    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Ereignis()
        obj.set_id(dictionary["id"])
        obj.set_zeitpunkt_ereigniseintritt(dictionary["zeitpunkt_ereigniseintritt"])

        return obj