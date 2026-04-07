package Wattmate.Service;

import Wattmate.DTO.SignupRequest;
import Wattmate.Entity.User;
import Wattmate.Entity.HouseholdType;
import Wattmate.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void signup(SignupRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setNickname(request.getNickname());
        user.setKepcoCustNo(request.getKepcoCustNo());

        user.setHouseholdType(
                HouseholdType.valueOf(request.getHouseholdType())
        );

        user.setEnergyTemp(36.5f);
        user.setCurrentPoint(0);
        user.setTotalPoint(0);

        userRepository.save(user);
    }
}